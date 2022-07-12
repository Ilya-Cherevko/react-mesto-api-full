export default class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl
        this._headers = options.headers
    }

    _fetch(path, method, body = null, token) {
        const url = this._baseUrl + path
        return fetch(url, {
            method,
            headers: {
                ...this._headers,
                authorization: 'Bearer ' + token
            },
            body
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`)
            })
    }

    _likeCard(cardId, method, token) {
        return this._fetch({path: `cards/${cardId}/likes`, method, token})
    }

    getUserInfo(token) {
        return this._fetch({path: 'users/me', method: 'GET', token})
    }

    getInitialCards(token) {
        return this._fetch({path: 'cards', method:'GET', token})
    }

    editUserInfo({ name, about, token }) {
        const body = () => {
            return JSON.stringify({
                name,
                about
            })
        }
        return this._fetch({path: 'users/me', method: 'PATCH', body, token})
    }

    addCard({ name, link }, token) {
        const body = () => {
            return JSON.stringify({
                name,
                link
            })
        }
        return this._fetch({path: 'cards', method:'POST', body, token})
    }

    deleteCard(cardId, token) {
        return this._fetch({ path: `cards/${cardId}`, method: 'DELETE', token})
    }

    addLikeCard(cardId, token) {
        return this._fetch({path: `cards/${cardId}/likes`, method: 'PUT', token}) //добавить лайк
    }
  
    deleteLikeCard(cardId) {
        return this._fetch(`cards/${cardId}/likes`, 'DELETE') //убрать лайк
    }

    editUserAvatar({ avatar }, token) {
        const body = () => {
            return JSON.stringify({
                avatar
            })
        }
        return this._fetch({path: 'users/me/avatar', method:'PATCH', body, token})
    }

    changeLikeCardStatus(cardId, isLiked, token) {
        return isLiked ?
            this._likeCard(cardId, 'PUT', token) :
            this._likeCard(cardId, 'DELETE', token)
    }
}