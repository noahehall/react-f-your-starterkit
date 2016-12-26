# example table
```
<section
  className='chart-container'
  ref={(container) => this.container = container}
  style={{
    display: 'block',
    fontSize: '8px',
    maxHeight: '400px',
    overflow: 'scroll',
    position: 'relative',
    verticalAlign: 'top',
    width: '100%',
  }}
>
  <Chart
    chart={this.props.table}
    chartDataGroupBy=''
    chartType='table'
    colorScaleScheme=''
    colorScaleType=''
    containerHeight={this.state.containerHeight}
    containerWidth={this.state.containerWidth}
    datumLabels={[]}
    filterable={true}
    id='table'
    margins={this.props.table.margins}
    preserveAspectRatio=''
    r=''
    sortable={true}
    xAxis={false}
    xAxisLabel=''
    xScale={false}
    xScaleTime={false}
    xScaleTimeFormat=''
    xValue=''
    yAxis={false}
    yAxisLabel=''
    yScale={false}
    yValue=''
  />
</section>
```

# example bar
```
<section
  className='chart-container'
  ref={(container) => this.container = container}
  style={{
    display: 'block',
    maxHeight: '400px',
    overflow: 'hidden',
    position: 'relative',
    verticalAlign: 'top',
    width: '100%',
  }}
>
  <Chart
    // https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
    chart={this.props.totalEmployees}
    chartDataGroupBy='' // eslintignore only used if xScaleTime = true
    chartType='bar' // eslintignore requires x and y axis to have integer values
    colorScaleScheme='schemeCategory20'
    colorScaleType='basic'
    containerHeight={this.state.containerHeight}
    containerWidth={this.state.containerWidth}
    datumLabels={['location']}
    id='employees-at-each-location'
    margins={this.props.totalEmployees.margins}
    preserveAspectRatio='xMinYMin meet'
    r={3.5}
    xAxis={true}
    xAxisLabel='Employees at Each Location'
    xScale={true}
    xScaleTime={false}
    xScaleTimeFormat='' // eslintlignore must match the format of your dates
    xValue='location'
    yAxis={true}
    yAxisLabel='Total Employees'
    yScale={true}
    yValue='totalEmployees' // eslintignore used for pie chart as well
  />
</section>
```

# example pie
```
<section
  className='chart-container'
  ref={(container) => this.container = container}
  style={{
    display: 'block',
    maxHeight: '400px',
    overflow: 'hidden',
    position: 'relative',
    verticalAlign: 'top',
    width: '100%',
  }}
>
  <Chart
    // https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
    chart={this.props.openIssues}
    chartDataGroupBy='' // eslintignore only used if xScaleTime = true
    chartType='pie'
    colorScaleScheme='schemeCategory20'
    colorScaleType='basic'
    containerHeight={this.state.containerHeight}
    containerWidth={this.state.containerWidth}
    datumLabels={[ 'status', 'total' ]}
    id='open-issues'
    margins={this.props.openIssues.margins}
    preserveAspectRatio='xMinYMin meet'
    r=''
    xAxis={false}
    xAxisLabel=''
    xScale={false}
    xScaleTime={false}
    xScaleTimeFormat='' // eslintlignore must match the format of your dates
    xValue=''
    yAxis={false}
    yAxisLabel=''
    yScale={true}
    yValue='total' // eslintignore used for pie chart slice size as well
  />
</section>
```

# example line
```
<section
  className='chart-container'
  style={{
    display: 'block',
    maxHeight: '400px',
    overflow: 'hidden',
    position: 'relative',
    verticalAlign: 'top',
    width: '100%',
  }}
>
  <Chart
    chart={this.props.payingCustomers}
    chartDataGroupBy='type'
    chartType='line'
    colorScaleScheme='schemeCategory20'
    colorScaleType='basic'
    containerHeight={this.state.containerHeight}
    containerWidth={this.state.containerWidth}
    datumLabels={['total']}
    id='paying-customers'
    margins={this.props.payingCustomers.margins}
    preserveAspectRatio='xMinYMin meet'
    r=''
    xAxis={true}
    xAxisLabel='Date'
    xScale={true}
    xScaleTime={true}
    xScaleTimeFormat='%Y/%m/%d'
    xValue='date'
    yAxis={true}
    yAxisLabel='Total Paying Customers'
    yScale={true}
    yValue='totalPayingCustomers'
  />
</section>
```
