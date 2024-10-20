import { useState, useEffect } from 'react';
// material-ui
import { Grid } from '@mui/material';
// project imports
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import WelcomeCard from './WelcomeCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import DirectReferral from './DirectReferral';
import IndirectReferral from './IndirectReferral';
import { gridSpacing } from 'store/constant';
import ProductProfit from './ProductProfit';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={6}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={6}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={12} lg={12}>
                <WelcomeCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={12} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <ProductProfit isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing} alignItems="stretch">
          <Grid item xs={6} lg={6} md={6} sm={6}>
            <DirectReferral isLoading={isLoading} />
          </Grid>
          <Grid item xs={6} lg={6} md={6} sm={6}>
            <IndirectReferral isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
