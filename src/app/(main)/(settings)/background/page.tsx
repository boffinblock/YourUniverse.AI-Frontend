

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import BackgroundPage from "@/components/pages/background-page";
export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="h-full " >
                    <BackgroundPage />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
