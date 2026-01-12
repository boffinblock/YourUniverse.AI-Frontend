
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import FolderPage from "@/components/pages/folder-page";


export default function page() {
    return (
        <div className="flex-1 flex flex-col relative ">
            <div className="flex-1 ">
                <Container className="h-full">
                    <FolderPage />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
