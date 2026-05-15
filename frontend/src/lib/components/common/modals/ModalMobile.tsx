import { useEffect, useState } from "react";

type Direction = "top" | "bottom" | "left" | "right";

const ModalMobile = ({
    Content,
    onClose,
    direction = "bottom",
}: {
    Content: React.ComponentType<any>;
    onClose: () => void;
    direction?: Direction;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /* close on Escape */
    useEffect(() => {
        const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [onClose]);

    /* open on mount */
    useEffect(() => {
        setIsOpen(true);
    }, []);

    /* close with animation */
    const closeWithTransition = () => {
        setIsOpen(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const config = {
        bottom: {
            classes: "left-0 bottom-0 w-full rounded-t-[32px] flex-col",
            transition: isOpen ? "translate-y-0" : "translate-y-full",
            handleStyle: "w-full h-8 flex items-center justify-center shrink-0",
            lineStyle: "w-12 h-1.5",
        },
        top: {
            classes: "left-0 top-0 w-full rounded-b-[32px] flex-col-reverse",
            transition: isOpen ? "translate-y-0" : "-translate-y-full",
            handleStyle: "w-full h-8 flex items-center justify-center shrink-0",
            lineStyle: "w-12 h-1.5",
        },
        left: {
            classes: "left-0 top-0 h-full w-[85vw] max-w-[400px] rounded-r-[32px] flex-row-reverse",
            transition: isOpen ? "translate-x-0" : "-translate-x-full",
            handleStyle: "h-full w-8 flex items-center justify-center shrink-0",
            lineStyle: "h-12 w-1.5",
        },
        right: {
            classes: "right-0 top-0 h-full w-[85vw] max-w-[400px] rounded-l-[32px] flex-row",
            transition: isOpen ? "translate-x-0" : "translate-x-full",
            handleStyle: "h-full w-8 flex items-center justify-center shrink-0",
            lineStyle: "h-12 w-1.5",
        },
    };

    const current = config[direction];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={closeWithTransition}
            />

            {/* Drawer */}
            <aside
                className={`fixed z-[70] bg-background shadow-2xl overflow-hidden transition-transform duration-300 ease-out flex ${current.classes} ${current.transition} max-h-[90vh] `}
            >
                {/* Grab Handle */}
                <div
                    className={`${current.handleStyle} cursor-grab active:cursor-grabbing`}
                    onClick={closeWithTransition}
                >
                    <div className={`${current.lineStyle} bg-text-color/20 rounded-full`} />
                </div>

                <div className="overflow-y-auto flex-1 h-full rounded-t-3xl">
                    <Content onClose={closeWithTransition} />
                </div>
            </aside>
        </>
    );
};

export default ModalMobile;