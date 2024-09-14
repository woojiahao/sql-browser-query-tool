import { Alignment, Button, H4, HTMLSelect, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import './App.css';
import { Editor } from '@monaco-editor/react';
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
// import 'monaco-sql-languages/esm/all.contributions';
// import { LanguageIdEnum, setupLanguageFeatures } from 'monaco-sql-languages';

function App() {
  // setupLanguageFeatures(LanguageIdEnum.PG, {
  //   completionItems: {
  //     enable: true,
  //     triggerCharacters: [' ', '.'],
  //   }
  // });

  return (
    <div className="container">
      <Navbar>
        <NavbarGroup>
          <NavbarHeading>
            SQL Browser Query Tool
          </NavbarHeading>
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <div className="button-group">
            <HTMLSelect options={[{ label: "PostgreSQL", value: "psql" }]} />
            <Button icon="document">Save query to file</Button>
            <Button icon="function">Save query as function</Button>
            <Button icon="eye-open">Preview query</Button>
            <Button icon="trash" intent="danger">Clear</Button>
            <Button icon="play" intent="success">Run</Button>
          </div>
        </NavbarGroup>
      </Navbar>

      <Editor options={{ automaticLayout: true }} className="editor" defaultLanguage="sql" />

      {/* <footer>
        <p>Copyright &copy; 2024 Woo Jia Hao</p>
      </footer> */}
    </div>
  );
}

export default App;
