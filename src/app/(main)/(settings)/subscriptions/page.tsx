
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import SubscriptionPages from "@/components/pages/subscription-page";

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 ">
                <Container className="">
                    <SubscriptionPages />
                </Container>
            </div>
            <Footer />
        </div>
    );
}

