import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerButton() {
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="">
        <Button disabled size="sm" className={`bg-transparent text-gray-800`}>
          <Spinner data-icon="" />
          Loading...
        </Button>
      </div>
    </main>
  );
}
