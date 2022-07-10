import PopupWithForm from "./PopupWithForm"
import Popup from "./Popup"

function ConfirmDeletePopup({ loader, isOpen, onClose, onDelete }) {

    function handleSubmit(evt) {
        evt.preventDefault()
        onDelete()
    }

    return (
        <Popup
            onClose={onClose}
            isOpen={isOpen}
        >
            <PopupWithForm
                name="delete"
                title="Вы уверены?"
                buttonText={loader ? "Удаление..." : "Да"}
                onClose={onClose}
                onSubmit={handleSubmit}
            ></PopupWithForm>
        </Popup>
    )
}

export default ConfirmDeletePopup