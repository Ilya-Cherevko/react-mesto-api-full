import { useState, useEffect } from 'react'
import { Route, Switch, useHistory } from "react-router-dom";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import Api from "../utils/Api"
import { optionsApi } from "../utils/optionsApi"
import * as auth from "../utils/Auth";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import ImagePopup from './ImagePopup'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ComfirmDeletePopup';

const api = new Api(optionsApi)

function App() {
    const history = useHistory()

    // Статус выполненого входа
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Статус для попапа подтверждения
    const [isSuccessfully, setIsSuccessfully] = useState(false)

    // E-mail пользовотеля
    const [userEmail, setUserEmail] = useState("Your email")

    // Состояние попапов
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
    const [isComfirmDeletePopupOpen, setIsComfirmDeletePopupOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState({ isOpen: false })
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)

    // Состояние загрузчиков
    const [isLoadingButton, setIsLoadingButton] = useState(false)

    // Данные пользовотеля и карточек
    const [currentUser, setCurrentUser] = useState({})
    const [cards, setCards] = useState([])

    // ID Карточки
    const [cardId, setCardId] = useState('')

    // Token
    const [token, setToken] = useState('')

    // Запрос данных пользователя и карточек с сервера
    useEffect(() => {
        if (isLoggedIn) {
            Promise.all([api.getUserInfo(token), api.getInitialCards(token)])
                .then(([user, cards]) => {
                    setCurrentUser(user)
                    setCards(cards)
                    setUserEmail(user.email)
                })
                .catch(err => console.log("Не удалось загрузить страницу:", err))
        }
    }, [isLoggedIn, token])

    // Вход по токену
    useEffect(function handleSignInProfileToken(){
        if (localStorage.getItem('jwt')) {
            const token = JSON.parse(localStorage.getItem('jwt'))

            auth.checkToken(token)
                .then(() => {
                    setToken(token)
                    setIsLoggedIn(true)
                    history.push('/')
                })
                .catch(e => {
                    console.log(e)
                    handleConfirmLoginClick()
                })
        }
    }, [history])

    // Управление состоянием попапов открытие
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true)
    }

    function handleComfirmDeleteClick(card) {
        setIsComfirmDeletePopupOpen(true)
        setCardId(card._id)
    }

    function handleConfirmRegisterClick() {
        setIsConfirmPopupOpen(true)
    }

    function handleConfirmLoginClick() {
        setIsSuccessfully(false)
        setIsConfirmPopupOpen(true)
    }

    // Управление состоянием попапов закрытие
    function closeAllPopups() {
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsComfirmDeletePopupOpen(false)
        setSelectedCard({ isOpen: false })
        setIsConfirmPopupOpen(false)
    }

    // Открыть большую карточку
    function handleCardClick(card) {
        setSelectedCard({
            isOpen: true,
            ...card
        })
    }

    // Обновить данные пользователя
    function handleUpdateUser(data) {
        setIsLoadingButton(true)

        api.editUserInfo(data, token)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось изменить данные профиля:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Обновить аватар пользователя
    function handleUpdateAvatar(data) {
        setIsLoadingButton(true)

        api.editUserAvatar(data, token)
            .then(res => {
                setCurrentUser(res)
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось сменить аватар:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Управление лайком карточки
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked, token)
            .then(newCard => {
                setCards(state => state.map(c => c._id === card._id ? newCard : c));
            })
            .catch(err => console.log("Не удалось изменить лайк:", err))
    }

    // Управление удалением карточки
    function handleCardDelete() {
        setIsLoadingButton(true)

        api.deleteCard(cardId, token)
            .then(() => {
                setCards(cards.filter(c => c._id !== cardId))
                setCardId('')
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось удалить карточку:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Управление добавлением карточки
    function handleAddPlaceSubmit(data) {
        setIsLoadingButton(true)

        api.addCard(data, token)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups()
            })
            .catch(err => console.log("Не удалось добавить карточку:", err))
            .finally(() => setIsLoadingButton(false))
    }

    // Регистрация
    function handleRegisterProfile({ password, email }) {
        setIsLoadingButton(true)

        auth.signUp({ password, email })
            .then(() => {
                setIsSuccessfully(true)
                handleConfirmRegisterClick()
                history.push('/sign-in')
            })
            .catch(err => {
                console.log(err)
                setIsSuccessfully(false)
                handleConfirmRegisterClick()
            })
            .finally(() => setIsLoadingButton(false))
    }

    // Вход в профиль
    function handleSignInProfile({ password, email }) {
        setIsLoadingButton(true)

        auth.signIn({ password, email })
            .then(res => {
                localStorage.setItem('jwt', JSON.stringify(res.token))
                setToken(res.token)
                setIsLoggedIn(true)
                history.push('/')
            })
            .catch(err => {
                console.log(err)
                handleConfirmLoginClick()
            })
            .finally(() => setIsLoadingButton(false))
    }

    // Выход из профиля
    function handleSignOutProfile() {
        setIsLoggedIn(false)
        localStorage.removeItem('jwt')
        setUserEmail("Your email")
        setCurrentUser({})
        setCards([])
        setToken('')
        history.push('/sign-in')
    }

    return (
        <div className="page">
          <CurrentUserContext.Provider value={currentUser}>
    
            <div className="container">
    
                <Header
                  path="/sign-in"
                  isLoggedIn={isLoggedIn}
                  onLoggOut={handleSignOutProfile}
                  userEmail={userEmail}
                />
    
               <Switch>
                  <Route path='/sign-in'>
                    <Login
                        onLogin={handleSignInProfile}
                        loader={isLoadingButton}
                    />
                  </Route>
    
                  <Route path='/sign-up'>
                    <Register
                      onRegister={handleRegisterProfile}
                      loader={isLoadingButton}
                    />
                  </Route>
    
                  <ProtectedRoute
                    path='/'
                    isLoggedIn={isLoggedIn}
                    onLoggOut={handleSignOutProfile}
                    userEmail={userEmail}
                    component={Main}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleComfirmDeleteClick}
                    />
    
                </Switch>
    
              <Footer/>
    
            {/* Информирование о результате регистрации */}
                <InfoTooltip
                  isOpen={isConfirmPopupOpen}
                  onClose={closeAllPopups}
                  isSuccessfully={isSuccessfully}
              />
                
          </div> 
    
            {/* Редактировать профиль */}
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              loader={isLoadingButton}
            />
    
            {/* Изменить аватар */}
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              loader={isLoadingButton}
            />
    
            {/* Добавить новое место */}
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              loader={isLoadingButton}
            />
    
            {/* Подтверждение удаления */}
            <ConfirmDeletePopup 
              isOpen={isComfirmDeletePopupOpen}
              onClose={closeAllPopups}
              onDelete={handleCardDelete}
              loader={isLoadingButton}
            />
    
            {/* Превью большой картинки */}
            <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
    
          </CurrentUserContext.Provider>  
        </div>
          
      );
}

export default App;
