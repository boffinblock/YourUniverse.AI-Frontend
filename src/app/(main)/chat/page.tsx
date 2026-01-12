
import Chats from "@/components/elements/chats";
import Container from "@/components/elements/container";
export default function page() {

    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 ">
                <Container className='h-full w-full  '>
                    <Chats />
                </Container>
            </div>
        </div>
    );
}
