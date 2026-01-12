

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import LorebookForm from "@/components/forms/lorebook-form";

export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl">
                    <LorebookForm />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
