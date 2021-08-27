import {IParent} from "../../interfaces/IParent";
import {IStudent} from "../../interfaces/IStudent";
import Parent from "../Parent";
import Student from "../Student";

const parentData: IParent = {
    FirstName: "TEST_FIRST_NAME_STRING",
    MiddleName: 'TEST_MIDDLE_NAME_STRING',
    LastName: 'TEST_LAST_NAME_STRING',
    ID: null
};

const studentData: IStudent = {
    FirstName: "TEST_FIRST_NAME_STRING",
    MiddleName: 'TEST_MIDDLE_NAME_STRING',
    LastName: 'TEST_LAST_NAME_STRING',
    ParentID: null,
    ID: null
};

let localParent1: Parent;
let localParent2: Parent;

let localChild1: Student;
let localChild2: Student;

test('setup local variables', async () => {
    expect.assertions(4);
    localParent1 = await Parent.addParent(parentData);
    localParent2 = await Parent.addParent(parentData);

    localChild1 = new Student(studentData);
    await localChild1.save();
    localChild2 = new Student(studentData);
    await localChild2.save();

    await expect(localParent1.exists()).resolves.toEqual(true);
    await expect(localParent2.exists()).resolves.toEqual(true);
    await expect(localChild1.exists()).resolves.toEqual(true);
    await expect(localChild2.exists()).resolves.toEqual(true);
});

test('student verifies parameters in addParent', async () => {
    expect.assertions(1);
    const parent = new Parent();
    await expect(localChild1.addParent(parent)).rejects.toEqual(`Parent you're trying to add does not have an ID`);
});

test('parents are added to the student', async () => {
    expect.assertions(4);
    await expect(localChild1.addParent(localParent1)).resolves.toBeInstanceOf(Student);
    await expect(localChild1.addParent(localParent2)).resolves.toBeInstanceOf(Student);
    await expect(localChild2.addParent(localParent1)).resolves.toBeInstanceOf(Student);
    await expect(localChild2.addParent(localParent2)).resolves.toBeInstanceOf(Student);
})

test('child returns the added parents IDs', async () => {
    expect.assertions(4);

    const child1Parents = await localChild1.getParents();
    const child2Parents = await localChild2.getParents();

    expect(child1Parents).toContain(localParent1.ID);
    expect(child1Parents).toContain(localParent2.ID);
    expect(child2Parents).toContain(localParent1.ID);
    expect(child2Parents).toContain(localParent2.ID);
});

test('parent returns the children ids', async () => {
    expect.assertions(4);
    const parent1Children = await localParent1.getChildren();
    const parent2Children = await localParent2.getChildren();

    expect(parent1Children).toContain(localChild1.ID);
    expect(parent1Children).toContain(localChild2.ID);
    expect(parent2Children).toContain(localChild1.ID);
    expect(parent2Children).toContain(localChild2.ID);
});

test('all parents and children are deleted', async () => {
    expect.assertions(4);
    await localParent1.delete();
    await localParent2.delete();
    await localChild1.delete();
    await localChild1.delete();

    await expect(localParent1.exists()).resolves.toEqual(false);
    await expect(localParent2.exists()).resolves.toEqual(false);
    await expect(localChild1.exists()).resolves.toEqual(false);
    await expect(localChild1.exists()).resolves.toEqual(false);
});
