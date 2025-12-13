import { useEffect, useState } from "react"

function Toast({ content, action, onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        if (content) {
            setIsVisible(false)
            setTimeout(() => {
                setIsVisible(true)
            }, 10);
            if (!action) {
                setTimeout(() => {
                    setIsVisible(false)
                    if (onClose) {
                        setTimeout(() => {
                            onClose()
                        }, 500);
                    }
                }, 2000);
            }
        }
        else {
            setIsVisible(false)
        }
    }, [content, action, onClose])
    return (
        <div className={`absolute top-5 left-1/2 -translate-x-1/2 mx-auto bg-background/50 backdrop-blur-lg border border-primary/50 p-3 rounded-lg transition-all duration-500 shadow-lg shadow-primary/50 select-none text-text flex gap-3 items-center ` + (isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0')}>
            {content}
            {action && (
                action.map((f, _) => (
                    <button
                        key={_}
                        onClick={() => {
                            setIsVisible(false)

                            setTimeout(() => {
                                f.function()
                            }, 500);
                        }}
                        className="rounded-lg bg-background-secondary border-primary/50 p-2 cursor-pointer hover:bg-background-secondary/80 transition-all duration-300"
                    >
                        {f.text}
                    </button>
                ))
            )}
        </div>
    )
}

export default Toast