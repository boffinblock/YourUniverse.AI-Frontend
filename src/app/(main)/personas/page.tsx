

import Footer from "@/components/layout/footer";
import PersonaPage from "@/components/pages/persona-page";

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 pt-10">
                <PersonaPage />
            </div>
            <Footer />
        </div>
    );
}
