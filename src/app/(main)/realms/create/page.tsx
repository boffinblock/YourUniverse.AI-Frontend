

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import RealmForm from "@/components/forms/Realm-form";
export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl h-full">
                    {/* <ComingSoon /> */}
                    <RealmForm />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
