import axios from 'axios';

export const URL = 'http://localhost:5000/'
//export const URL = '/'
export const config = {
    headers: {
        "Accept": "application/json;odata=verbose",
        'Content-Type': 'application/json;charset=UTF-8',//

        'Cache-Control': 'no-cache,no-store',
        //'Access-Control-Allow-Origin': 'http://localhost:5000/',
        'Access-Control-Allow-Origin': URL,
        'Access-Control-Allow-Credentials': 'true',
        // 'Authorization' : 'Bearer ' +"5hIOXDhhUh3100nqeRj4ZUa_rLN2Ru05G8C-WzgVnUjDbDdjNTNKAeRgfQiJRJoceYizp14ddSkUKDOIfet7lGBC8RQNuEN9ZpGuqlJ01yuzlnyt-wDdL4C5pLYQlqh4hcP2zxbKvNRUq4wMqqW6PjEdB3qlHqOT2SFyaF7CEuhJF8Bjrzic5oEocsxuLK4kZK-afbK0deuYylAPJvJzO5XvH7ExCZ3IfY-NPBRdv5EDEkuwnlS9TCvG-1rYk8LIZaLZpIHRbSFPMTQze5KnqVlWa8HIodApsCZwPjiYIv5bY-VrpXSE9qGyqNzyEgKsG5Rpw-KV5VtVeA04P3vdFW2vKne6XdOulj3Qh8NjRCZ0AwYlKAG9M0KtCZevpUOYdhpaYJMiBg1l2vz9rASlgacrYmdv2wpWVrN5h-KhMxt7WECM9JyC1ATxUPmbZQoI_qo3j4US2wN581RypVDvp5SonPoA__0CT8KsXMlTCjM"//sessionStorage.getItem("accessToken")
    }
}

export const getAllItem = (storeIndex,params) => {
    config.params = { userId: JSON.parse(localStorage.getItem('user')).id, token: localStorage.getItem('token') }
    if(params)config.params={...config.params,...params}
  
    return axios.get(
        URL + "api/" + storeIndex,
        config
    )
}
export const getPrevItems = (storeIndex, contract_id, period_id) => {
    config.params = {
        userId: JSON.parse(localStorage.getItem('user')).id,
        token: localStorage.getItem('token'),
        contract_id, period_id
    }
    return axios.get(
        URL + "api/" + storeIndex + "/getPrev",
        config
    )
}
export const getItem = (id, storeIndex) => {
    config.params = { userId: JSON.parse(localStorage.getItem('user')).id, token: localStorage.getItem('token') }
    return axios.get(
        URL + "api/" + storeIndex + "/" + id,
        config
    )
}
export const upsertItem = (data, storeIndex) => {
    data['user_id'] = JSON.parse(localStorage.getItem('user')).id;
    data['current_date'] = new Date();

    return axios.post(
        URL + "api/" + storeIndex + "/upsert", data,
        config
    )
}
export const saveItem = (data, storeIndex, ct) => {
    if (ct) {
        config['Content-Type'] = ct;

        let dt = JSON.parse(data.get('data'));
        dt['creator_id'] = JSON.parse(localStorage.getItem('user')).id;
        dt['create_date'] = new Date();
        data.delete('data');
        data.append("data", JSON.stringify(dt));
    }
    else {
        data['creator_id'] = JSON.parse(localStorage.getItem('user')).id;
        data['create_date'] = new Date();
    }
    return axios.post(
        URL + "api/" + storeIndex, data,
        config
    )
}

export const updateItem = (data, storeIndex, ct) => {
    let id = data.id;
    if (ct) {
        config['Content-Type'] = ct;

        let dt = JSON.parse(data.get('data'));
        id = dt.id;
        dt['editor_id'] = JSON.parse(localStorage.getItem('user')).id;
        dt['edit_date'] = new Date();
        data.delete('data');
        data.append("data", JSON.stringify(dt));
    }
    else {
        data['editor_id'] = JSON.parse(localStorage.getItem('user')).id;
        data['edit_date'] = new Date();
    }
    return axios.put(
        URL + "api/" + storeIndex + "/" + id, data,
        config
    )
}
export const removeItem = (id, storeIndex) => axios.delete(
    URL + "api/" + storeIndex + "/" + id,
    config
)
export const login = (data) => axios.post(
    URL + "api/User/signin/", data,
    config
)
export const verifyToken = (data) => axios.post(
    URL + "api/User/verifyToken/", data,
    config
)
export const updatePassword = (data) => axios.put(
    URL + "api/User/updatePassword", data,
    config
)

