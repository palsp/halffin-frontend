import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "ui-component/extended/TabPanel";

const TabPanels = ({ value, labels, components, onChange }) => {
  return (
    <>
      <Tabs value={value} onChange={onChange}>
        {components.map((comp) => (
          <Tab label={comp.label} />
        ))}
      </Tabs>
      {components.map(({ component }, index) => (
        <TabPanel value={value} index={index}>
          {component}
        </TabPanel>
      ))}
    </>
  );
};

export default TabPanels;
