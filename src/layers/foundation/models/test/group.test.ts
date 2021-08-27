import {IGroup} from "../../interfaces/IGroup";
import {IStudent} from "../../interfaces/IStudent";
import Student from "../Student";
import Group from "../Group";
import exp from "constants";

const groupData: IGroup = {
    ID: null,
    Name: 'TEST_GROUP 1'
};

const student1Data: IStudent = {
    FirstName: "TEST_FIRST_NAME_STRING",
    MiddleName: 'TEST_MIDDLE_NAME_STRING',
    LastName: 'TEST_LAST_NAME_STRING',
    ParentID: null,
    ID: null
}

const student2Data: IStudent = {
    FirstName: "TEST_FIRST_NAME_STRING 2",
    MiddleName: 'TEST_MIDDLE_NAME_STRING 2',
    LastName: 'TEST_LAST_NAME_STRING 2',
    ParentID: null,
    ID: null
}

const student1 = new Student(student1Data);
const student2 = new Student(student2Data);

let group: Group|null = null;

test('group creates and saves to database', async () => {
    group = new Group(groupData);

    expect.assertions(5)
    expect(group.ID).toEqual(groupData.ID);
    expect(group.Name).toEqual(groupData.Name);

    await expect(group.exists()).resolves.toEqual(false);
    await expect(group.save()).resolves.toEqual(true);
    await expect(group.exists()).resolves.toEqual(true);
});

test('group detects if unsaved student is being added', async () => {
    await expect(group?.addStudent(student1)).rejects.toEqual(
        `Can't add an usaved/unloaded student to this group`);
    await student1.save();
    await student2.save();
})

test('students add to group', async () => {
    expect.assertions(8);
    expect(group?.isEmpty()).toEqual(true);
    await expect(group?.addStudent(student1)).resolves.toEqual(true);
    expect(group?.isEmpty()).toEqual(false);
    let students = group?.getStudents();
    expect(students?.length).toEqual(1);
    await expect(group?.addStudent(student2)).resolves.toEqual(true);
    students = group?.getStudents();
    expect(students?.length).toEqual(2);

    const student1DBClone = students?.find((student: Student) => {
        return student.ID === student1.ID;
    })
    expect(student1DBClone).toBeDefined();

    const student2DBClone = students?.find((student: Student) => {
        return student.ID === student2.ID;
    })
    expect(student2DBClone).toBeDefined();
})

