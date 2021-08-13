import app from '../app';

test('App object is created and returned', () => {
    expect(app).toEqual(expect.anything()); //non-null
});
