import Student from "../student";
import {IStudent} from "../../interfaces/IStudent";
import {validate as uuidValidate} from "uuid";
import {type} from "os";

const studentData: IStudent = {
    FirstName: "TEST_FIRST_NAME_STRING",
    MiddleName: 'TEST_MIDDLE_NAME_STRING',
    LastName: 'TEST_LAST_NAME_STRING',
    ParentID: null,
    ID: null
};

let localStudent: Student|null = null;

test ("student save  tests that the first and last name exists", async () => {
    expect.assertions(2);
    localStudent = new Student({
        FirstName: null,
        MiddleName: studentData.MiddleName,
        LastName: studentData.LastName
    } as IStudent);

    await expect(localStudent.save()).rejects.toEqual("First name of the student must be provided");

    localStudent.setData({
        MiddleName: studentData.MiddleName,
        FirstName: studentData.FirstName,
        LastName: null
    } as IStudent)

    await expect(localStudent.save()).rejects.toEqual("Last name of the student must be provided");
});

// TODO: move this to databaseEntity
test ("unsaved student detects that it does not exist in database", async () => {
    console.log(localStudent?.ID);
    await expect(localStudent?.exists()).resolves.toEqual(false);
});

test ("student is being saved to the database and instance returned", async () => {
    expect.assertions(4);

    localStudent?.setData(studentData);
    await expect(localStudent?.save()).resolves.toBeInstanceOf(Student);
    expect(localStudent).toHaveProperty('ID');
    console.log(localStudent?.ID);
    expect(typeof localStudent?.ID).toEqual('string');
    expect(uuidValidate(localStudent?.ID as string)).toBe(true);

    if(localStudent?.ID){ // for typescript
        studentData.ID = localStudent.ID;
    }
})

test ("saved student record exists in database", async () => {
    expect.assertions(2);
    const student = new Student({"ID": studentData.ID} as IStudent);
    await expect(student.exists()).resolves.toEqual(true);
    await expect(student.load()).resolves.toBeInstanceOf(Student);
    localStudent = student;
})

test("student data is saved correctly", () => {
    expect(localStudent).not.toBe(null);
    if(localStudent != null) {
        expect(localStudent.FirstName).toEqual(studentData.FirstName)
        expect(localStudent.MiddleName).toEqual(studentData.MiddleName);
        expect(localStudent.LastName).toEqual(studentData.LastName);
        expect(localStudent.ID).toEqual(studentData.ID);
    }
});

test('student count returns a number > 0', async () => {
    expect.assertions(2);
    const count = await Student.getCount();
    expect(typeof count).toEqual('number');
    expect(count > 0).toBe(true);
})

// TODO: Move this test into a databaseEntity test
test("student is getting deleted", async () => {
    expect.assertions(3);
    await expect(localStudent?.delete()).resolves.toEqual(true);
    await expect(Student.getStudentByID(studentData.ID as string))
        .rejects.toEqual(`Entity with id ${studentData.ID} has not been found`);
    await expect(localStudent?.exists()).resolves.toEqual(false);
})
