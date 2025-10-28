const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }
    const notificationStyle = notification.isError ? errorStyle : {...errorStyle, color: 'green'}

    return (
        <div style={notificationStyle}>
            {notification.message}
        </div>
    )
}

export default Notification;