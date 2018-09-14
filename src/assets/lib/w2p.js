try {
    var Word = new ActiveXObject("Word.Application");
    if (Word) {
        var documents = Word.Documents;
        var file = documents.Open(WScript.Arguments(0));
        file.SaveAs2(WScript.Arguments(1), 17);
        documents.Close();
        Word.Quit();
    }
}
catch (err) {
    WScript.StdErr.WriteLine(err.message);
    WScript.Quit(1);
}