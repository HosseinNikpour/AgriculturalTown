import axios from 'axios';

export const URL = 'http://localhost:5000/'//'http://localhost:5000/'
export const header = {
    headers: {
        "Accept": "application/json;odata=verbose",
        'Content-Type': 'application/json;charset=UTF-8',//

        'Cache-Control': 'no-cache,no-store',
        'Access-Control-Allow-Origin': 'http://localhost:5000/',//'http://localhost:5000',
        'Access-Control-Allow-Credentials': 'true',
        // 'Authorization' : 'Bearer ' +"5hIOXDhhUh3100nqeRj4ZUa_rLN2Ru05G8C-WzgVnUjDbDdjNTNKAeRgfQiJRJoceYizp14ddSkUKDOIfet7lGBC8RQNuEN9ZpGuqlJ01yuzlnyt-wDdL4C5pLYQlqh4hcP2zxbKvNRUq4wMqqW6PjEdB3qlHqOT2SFyaF7CEuhJF8Bjrzic5oEocsxuLK4kZK-afbK0deuYylAPJvJzO5XvH7ExCZ3IfY-NPBRdv5EDEkuwnlS9TCvG-1rYk8LIZaLZpIHRbSFPMTQze5KnqVlWa8HIodApsCZwPjiYIv5bY-VrpXSE9qGyqNzyEgKsG5Rpw-KV5VtVeA04P3vdFW2vKne6XdOulj3Qh8NjRCZ0AwYlKAG9M0KtCZevpUOYdhpaYJMiBg1l2vz9rASlgacrYmdv2wpWVrN5h-KhMxt7WECM9JyC1ATxUPmbZQoI_qo3j4US2wN581RypVDvp5SonPoA__0CT8KsXMlTCjM"//sessionStorage.getItem("accessToken")
    }
}

export const getAllItem = (storeIndex) => axios.get(
    URL + "api/" + storeIndex,
    header
)

export const getItem = (id, storeIndex) => axios.get(
    URL + "api/" + storeIndex + "/" + id,
    header
)

export const saveItem = (data, storeIndex, ct) => {
    if (ct) header['Content-Type'] = ct;
    data['creator_id'] = JSON.parse(localStorage.getItem('user')).id;
    data['create_date'] = new Date();
    return axios.post(
        URL + "api/" + storeIndex, data,
        header
    )
}

export const updateItem = (data, storeIndex) => {
    data['editor_id'] = JSON.parse(localStorage.getItem('user')).id;
    data['edit_date'] = new Date();

    return axios.put(
        URL + "api/" + storeIndex + "/" + data.id, data,
        header
    )
}

export const removeItem = (id, storeIndex) => axios.delete(
    URL + "api/" + storeIndex + "/" + id,
    header
)
// export const uploadFile = (data) => axios.post(
//     URL + "api/upload/", data,
//     header
// )
export const login = (data) => axios.post(
    URL + "api/User/signin/", data,
    header
)
export const verifyToken = (data) => axios.post(
    URL + "api/User/verifyToken/", data,
    header
)
export const updatePassword = (data) => axios.put(
    URL + "api/User/updatePassword/", data,
    header
)