import sum from '../sum.js';

export async function getData(req, res) { res.status(200).json({ sum }); }
export async function addData(req, res) {
    console.log(req.body);
    const newRecord = req.body;
    sum.push(newRecord);
    res.status(201).json(sum);
}
export async function updateData(req, res) {
    const newRecord = req.body;
    const idToEdit = Number(req.params.id);
    const updatedsum = sum.map((obj) => (obj.id === idToEdit ? newRecord : obj));
    res.status(200).json(updatedsum);
}
export async function deleteData(req, res) {
    const id = Number(req.params.id)
    const updatedsum = sum.filter((obj) => obj.id !== id);
    res.status(200).json(updatedsum);
}