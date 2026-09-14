const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const returnStatementOld = `  return (
  <StudentsCtx.Provider value={{list, add:addStudent}}>
  <UI.Provider value={uiCtx}>
    <div className="min-h-screen w-full flex items-center justify-center" style={{background:"#E8E4DD",fontFamily:PJS}}>`;

const returnStatementNew = `  return (
  <StudentsCtx.Provider value={{list, add:addStudent}}>
  <UI.Provider value={uiCtx}>
    {screen === "landing" ? (
      <LandingScreen onNext={()=>go("role-select")}/>
    ) : (
    <div className="min-h-screen w-full flex items-center justify-center" style={{background:"#E8E4DD",fontFamily:PJS}}>`;

code = code.replace(returnStatementOld, returnStatementNew);

// Also need to close the ternary at the end
const endStatementOld = `  </UI.Provider>
  </StudentsCtx.Provider>
  );
}`;

const endStatementNew = `    )}
  </UI.Provider>
  </StudentsCtx.Provider>
  );
}`;

code = code.replace(endStatementOld, endStatementNew);

// Inside App.tsx renderScreen(), we should return null for landing since it's handled above
code = code.replace(
  `case "landing":      return <LandingScreen onNext={()=>go("role-select")}/>;`,
  `case "landing":      return null;`
);

fs.writeFileSync('src/app/App.tsx', code);
