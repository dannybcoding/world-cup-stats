# Apache JMeter load testing

This folder contains an Apache JMeter test plan for load testing the `/stats` route in the local app.

The test plan is intentionally limited to requesting the `/stats` page from the local Vite server to avoid consuming the external football API quota and to remain compatible with JMeter 5.6.3.

## Run the load test

1. Start the local app server:

```bash
npm run dev
```

2. In another terminal, run the JMeter plan with the CLI:

```bash
npm run load:test:verify
```

This script first checks that Java is installed and available on the PATH. If Java is missing or broken, it prints a helpful message instead of attempting to run JMeter.

If JMeter is not on PATH or your Java command is still not working, use the direct local Java wrapper script:

```bash
npm run load:test:local:java
```

This now runs `jmeter/run-jmeter-local-java.cmd`, which prints start and completion messages and logs exit status.

The script creates the `jmeter/results` directory and writes results to:

- `jmeter/results/teams-page-load-test.jtl`

If `load:test:local:java` also fails, please verify your Java installation path and update the `JAVA_HOME` value in `jmeter/run-jmeter-local-java.cmd` accordingly.

## JMeter plan details

- `jmeter/teams-page-load-test.jmx`
- 50 concurrent users
- 10 second ramp-up
- one GET request to `/stats`
- response validation confirms the Stats page heading is present
- no football API endpoints are requested

## Notes

If you want to use the JMeter GUI instead of the CLI, open `jmeter/teams-page-load-test.jmx` in JMeter and run it from there.
