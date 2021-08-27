import {validate as uuidValidate} from "uuid";
import Parent from "../Parent";
import {IParent} from "../../interfaces/IParent";

const parentData: IParent = {
    FirstName: "TEST_FIRST_NAME_STRING",
    MiddleName: 'TEST_MIDDLE_NAME_STRING',
    LastName: 'TEST_LAST_NAME_STRING',
    ID: null
};

let localParent: Parent | null = null;

test ("addParent method tests that the first name and last name exists", async () => {
    expect.assertions(2);
    await expect(
        Parent.addParent({
            MiddleName: parentData.MiddleName,
            LastName: parentData.LastName
        } as IParent)
    )
        .rejects.toEqual("First name of the parent must be provided");
    await expect(
        Parent.addParent({
            MiddleName: parentData.MiddleName,
            FirstName: parentData.FirstName
        } as IParent)
    )
        .rejects.toEqual("Last name of the parent must be provided");

});

test ("unsaved parent detects that it does not exist in database", async () => {
    const parent = new Parent(parentData);
    await expect(parent.exists()).resolves.toEqual(false);
});

test ("parent is being saved to the database and instance returned", async () => {
    expect.assertions(3);

    localParent = await Parent.addParent(parentData);
    expect(localParent).toHaveProperty('ID');
    expect(typeof localParent.ID).toEqual('string');
    expect(uuidValidate(localParent.ID as string)).toBe(true);

    parentData.ID = localParent.ID;
})

test ("saved parent record exists in database", async () => {
    expect.assertions(3);
    await expect(localParent).not.toBe(null);
    await expect(localParent?.exists()).resolves.toEqual(true);
    await expect(localParent?.load()).resolves.toBeInstanceOf(Parent);
})

test("parent data is saved correctly", () => {
    expect(localParent).not.toBe(null);
    if(localParent != null) {
        expect(localParent.FirstName).toEqual(parentData.FirstName)
        expect(localParent.MiddleName).toEqual(parentData.MiddleName);
        expect(localParent.LastName).toEqual(parentData.LastName);
        expect(localParent.ID).toEqual(parentData.ID);
    }
})

test('parent count returns a number > 0', async () => {
    expect.assertions(2);
    const count = await Parent.getParentCount();
    expect(typeof count).toEqual('number');
    expect(count > 0).toBe(true);
})

test("parent is getting deleted", async () => {
    expect.assertions(3);
    await expect(localParent?.delete()).resolves.toEqual(true);
    await expect(Parent.getParentByID(parentData.ID as string))
        .rejects.toEqual(`Entity with id ${parentData.ID} has not been found`);
    await expect(localParent?.exists()).resolves.toEqual(false);
})




