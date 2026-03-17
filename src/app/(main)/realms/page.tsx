
import Container from "@/components/elements/container";
import RealmsPage from "@/components/pages/realms-page";


export default function page() {
    return (
        <div className="flex-1 flex flex-col relative ">
            <div className="flex-1 ">
                <Container className="h-full">
                    <RealmsPage />
                </Container>
            </div>
        </div>
    );
}
