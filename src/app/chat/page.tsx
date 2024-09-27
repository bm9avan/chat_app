import Friend from "@/components/custom/chat/Friend";

const page = () => {
  return (
    <div className="flex justify-center items-center h-full w-full px-10">
      <div className="flex flex-col justify-center text-center items-center gap-4">
        <p className="text-muted-foreground text-center">
          Click on a chat to view the messages
        </p>
        <Friend />
      </div>
    </div>
  );
};

export default page;
