import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import AttributeForm from "@/components/forms/attribute-form";
export default function page() {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl">
                    <AttributeForm />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
