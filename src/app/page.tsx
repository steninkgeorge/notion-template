import Editor from './component/editor';
import { Toolbar } from './component/toolbar';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <Toolbar />
      <Editor />
    </div>
  );
}
