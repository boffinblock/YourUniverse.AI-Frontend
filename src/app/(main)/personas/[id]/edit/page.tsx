

import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import PersonaForm from "@/components/forms/persona-form";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl h-full">
                    <PersonaForm personaId={id} />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
