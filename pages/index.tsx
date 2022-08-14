import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Shell from '../components/Shell/Shell';

export default function HomePage() {
  return (
    <Shell>
      <Welcome />
      <ColorSchemeToggle />
    </Shell>
  );
}
