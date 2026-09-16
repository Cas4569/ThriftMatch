import AuthGuard from "../../components/AuthGuard";

export default function MenswearLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
