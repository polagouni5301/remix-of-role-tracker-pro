import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl font-bold tracking-tight">404</div>
        <p className="mt-2 text-muted-foreground">That page isn't part of the tracker.</p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}
