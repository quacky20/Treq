import Avatar from "./components/Avatar"

function Contact({ id, selected, username, onClick, online }) {
    return (
        <div
            key={id}
            onClick={() => onClick(id)}
            className={"px-3 text-white flex items-center gap-2 py-3 cursor-pointer hover:bg-primary/20 my-3 rounded-md transition-all duration-300 " + (selected ? "bg-primary/40 hover:bg-primary/50" : "")}
        >
            <Avatar
                username={username}
                userID={id}
                online={online}
            />
            <span>{username}</span>
        </div>
    )
}

export default Contact