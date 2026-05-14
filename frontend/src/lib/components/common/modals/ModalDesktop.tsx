import { useState, useEffect } from "react";

const ModalDesktop = ({
    Content,
    onClose,
    bgTransparent = false,
    contentProps = {},
}: {
    Content: React.ComponentType<any>;
    onClose: () => void;
    bgTransparent?: boolean;
    contentProps?: any;
}) => {
    const [isOpen, setIsOpen] = useState<any>(false);
    useEffect(() => {
        setIsOpen(true);
    }, []);

    const closeWithTransition = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    return (
        <dialog
            className={`absolute z-10 inset-0 fixed min-h-[500px] h-screen w-full  flex justify-center items-center bg-transparent overflow-scroll`}
            open={isOpen}
        >
            <div
                className={`fixed inset-0 z-40  ${isOpen ? " bg-black/60 " : " bg-black/10"
                    } transition duration-300 ease-in-out`}
                onClick={closeWithTransition}
            />
            <div
                className={`${!bgTransparent
                    ? "bg-white rounded-[50px] p-[50px] w-auto "
                    : " w-full"
                    }    ${isOpen ? "scale-full opacity-100" : "scale-0 opacity-0"
                    } transition-all duration-300 ease-in-out  z-50 overflow-scroll overflow-y-auto max-h-[95vh] `}
            >
                <Content onClose={closeWithTransition} {...contentProps} />
            </div>
        </dialog>
    );
};

export default ModalDesktop;