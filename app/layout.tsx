import { title } from "process"
import "./global.css"

export const metadata = {
    title: "F1GPT",
    description: "Fast cars even fasters answers to your Formula One questions!"
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}


export default RootLayout