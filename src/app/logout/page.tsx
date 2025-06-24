"use client"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
    const router = useRouter()
    useEffect(() => {
        signOut({
            redirect: false
        }).then(() => {
            router.push("/")
        }).catch((err) => {
            console.log(err)
        })
    }, [router])

    return (<></>);
}

export default Logout;