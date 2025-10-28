import axios from "axios";

const baseUrl = '/api/persons'

const getAll = () => axios.get(baseUrl).then( (resp) => resp.data )
const create = (obj) => axios.post(baseUrl, obj).then( (resp) => resp.data )
const remove = (id) => axios.delete(`${baseUrl}/${id}`)
const update = (id, obj) => axios.put(`${baseUrl}/${id}`, obj).then((resp) => resp.data)

export default {
    getAll,
    create,
    remove,
    update
}