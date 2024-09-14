import { Alert, Alignment, Button, Dialog, DialogBody, DialogFooter, Drawer, H4, HTMLSelect, HTMLTable, InputGroup, Navbar, NavbarGroup, NavbarHeading } from '@blueprintjs/core';
import './App.css';
import { Editor } from '@monaco-editor/react';
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import axios from "axios";
// import 'monaco-sql-languages/esm/all.contributions';
// import { LanguageIdEnum, setupLanguageFeatures } from 'monaco-sql-languages';

const query = axios.create({
  baseURL: "http://localhost:3001"
})

function App() {
  // setupLanguageFeatures(LanguageIdEnum.PG, {
  //   completionItems: {
  //     enable: true,
  //     triggerCharacters: [' ', '.'],
  //   }
  // });
  const [databaseName, setDatabaseName] = useState<string>("sql_browser_query_tool");
  const [editorValue, setEditorValue] = useState<string | undefined>("SELECT * FROM foo;");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isSaveToFileDialogOpen, setIsSaveToFileDialogOpen] = useState<boolean>(false);
  const [previewColumns, setPreviewColumns] = useState<string[]>([]);
  const [previewValues, setPreviewValues] = useState<object[]>([]);
  const [saveFileQueryName, setSaveFileQueryName] = useState<string>("query");
  const [isForbiddenAlertOpen, setIsForbiddenAlertOpen] = useState<boolean>(false);

  const handleDownloadFile = useCallback(async () => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/sql;charset=utf-8,' + encodeURIComponent(editorValue!));
    element.setAttribute('download', `${saveFileQueryName}.sql`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }, [editorValue, saveFileQueryName])

  const handlePreviewQuery = useCallback(async () => {
    try {
      const result = await query.post("/query/execute", {
        databaseName,
        query: editorValue
      })
      setPreviewColumns(result.data.columns)
      setPreviewValues(result.data.values)
      setIsPreviewOpen(true);
    } catch (e) {
      console.log(e)
      setIsForbiddenAlertOpen(true)
    }
  }, [databaseName, editorValue])

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
            <InputGroup
              asyncControl={true}
              leftIcon="search"
              placeholder="Database name..."
              defaultValue="sql_browser_query_tool"
              onChange={(value: ChangeEvent<HTMLInputElement>) => setDatabaseName(value.target.value)}
            />
            <Button onClick={() => setIsSaveToFileDialogOpen(true)} icon="document" disabled={editorValue == null || editorValue === ""}>Save query to file</Button>
            <Button icon="function" disabled={editorValue == null || editorValue === ""}>Save query as function</Button>
            {/* <Button onClick={} icon="trash" intent="danger" disabled={editorValue == null || editorValue === ""}>Clear</Button> */}
            <Button onClick={handlePreviewQuery} icon="eye-open" intent="success" disabled={editorValue == null || editorValue === ""}>Preview query</Button>
          </div>
        </NavbarGroup>
      </Navbar>

      <Editor onChange={(value: string | undefined) => setEditorValue(value)} options={{ automaticLayout: true }} className="editor" defaultLanguage="sql" defaultValue="SELECT * FROM foo;" />

      <PreviewDrawer
        columns={previewColumns}
        rows={previewValues}
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen} />

      <Dialog title="Save query to file" icon="document" onClose={() => setIsSaveToFileDialogOpen(false)} isOpen={isSaveToFileDialogOpen}>
        <DialogBody>
          <p>Save your query</p>
          <pre>{editorValue}</pre>
        </DialogBody>
        <DialogFooter actions={<Button intent="primary" text="Save" onClick={handleDownloadFile} />}>
          <InputGroup asyncControl={true} placeholder="Query name..." defaultValue="query" onChange={(value: ChangeEvent<HTMLInputElement>) => setSaveFileQueryName(value.target.value)} />
        </DialogFooter>
      </Dialog>

      <Alert
        confirmButtonText="Okay"
        isOpen={isForbiddenAlertOpen}
        onClose={() => setIsForbiddenAlertOpen(false)}
      >
        <p>
          You do not have the right permissions to perform this query. Only <code>SELECT</code> is enabled in this environment.
        </p>
      </Alert>


      {/* <footer>
      <p>Copyright &copy; 2024 Woo Jia Hao</p>
      </footer> */}
    </div>
  );
}

function PreviewDrawer({
  columns,
  rows,
  isPreviewOpen,
  setIsPreviewOpen
}: {
  columns: string[];
  rows: object[];
  isPreviewOpen: boolean;
  setIsPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Drawer
      icon="eye-open"
      onClose={() => setIsPreviewOpen(false)}
      title="Preview Query"
      isOpen={isPreviewOpen}
      size="smallest"
      position="bottom"
      hasBackdrop={false}
    >
      <HTMLTable bordered={true} striped={true}>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            // @ts-ignore
            const c = columns.map(col => <td>{row[col]}</td>)
            return <tr>{c}</tr>
          })}
        </tbody>
      </HTMLTable>
    </Drawer>
  )
}

export default App;
