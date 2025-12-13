import { forwardRef } from "react"

const Menu = forwardRef(({ onDeleteAccount, onDeleteChats }, ref) => {
    return (
        <div
        ref={ref}
            className="rounded-lg absolute top-14 right-3 bg-background-secondary/50 flex flex-col gap-2 text-text backdrop-blur-lg border border-primary/50"
        >
            <div
                onClick={onDeleteAccount}
                className="hover:bg-background-secondary/20 transition-all duration-200 p-3 cursor-pointer"
            >
                Delete account
            </div>
            <div
                onClick={onDeleteChats}
                className="hover:bg-background-secondary/20  transition-all duration-200 p-3 cursor-pointer"
            >
                Delete chats
            </div>
        </div>
    )
})

export default Menu