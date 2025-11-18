import Navbar from "@/components/Navbar";
import Fields from "@/components/Fields";
import TableData from "@/components/TableData";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div id="Content">
        <Fields />
      </div>
      <TableData />
    </main>
  );
}
