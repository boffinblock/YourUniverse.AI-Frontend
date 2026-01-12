
import Footer from "@/components/layout/footer";
import CharacterPage from "@/components/pages/character-page";


export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 pt-10 ">
                <CharacterPage />
            </div>
            <Footer />
        </div>
    );
}
