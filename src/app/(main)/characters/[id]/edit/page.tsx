
import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import CharacterForm from "@/components/forms/character-form";

export default async function EditCharacterPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl">
                    <CharacterForm characterId={id} />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
