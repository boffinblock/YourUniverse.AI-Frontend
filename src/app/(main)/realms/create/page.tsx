

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import FolderForm from "@/components/forms/folder-form";
export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl h-full">
                    {/* <ComingSoon /> */}
                    <FolderForm />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
