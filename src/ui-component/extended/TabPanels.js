import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from 'ui-component/extended/TabPanel';

const TabPanels = ({
  value,
  labels,
  components,
  onChange,
  color = 'white',
}) => {
  return (
    <>
      <Tabs
        value={value}
        onChange={onChange}
        centered
        sx={{ marginTop: '8px' }}
      >
        {components.map((comp) => (
          <Tab
            label={comp.label}
            sx={{
              color,
            }}
          />
        ))}
      </Tabs>
      {components.map(({ component }, index) => (
        <TabPanel
          value={value}
          index={index}
          sx={{
            color: 'white',
          }}
        >
          {component}
        </TabPanel>
      ))}
    </>
  );
};

export default TabPanels;
