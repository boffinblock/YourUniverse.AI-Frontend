import Footer from "@/components/layout/footer";
import Container from "@/components/elements/container";
import RealmForm from "@/components/forms/Realm-form";

export default async function EditRealmPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1">
                <Container className="max-w-4xl h-full">
                    <RealmForm realmId={id} />
                </Container>
            </div>
            <Footer />
        </div>
    );
}
