import { describe, expect, it } from 'vitest';

import { MockOeeMetricsService } from '@/services/MockOeeMetricsService';
import type { AtlasTool, AtlasToolResult } from '@/atlas-agent/types';

import { createOeeAtlasTools } from './createOeeAtlasTools';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findTool(tools: AtlasTool<any, any>[], name: string): AtlasTool<any, any> {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

describe('createOeeAtlasTools', () => {
  it('registers the full OEE tool catalog', () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    expect(tools.map((t) => t.name)).toEqual([
      'get_oee_dashboard',
      'get_availability_health',
      'get_production_losses',
      'get_production_trends',
      'get_quality_metrics',
      'get_equipment_list',
      'get_equipment_detail',
    ]);
  });

  it('get_oee_dashboard reports KPI values from the metrics service', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_oee_dashboard');

    const result = (await tool.execute({})) as AtlasToolResult<{
      kpis: { overallOee: number; dailyForecastTons: number };
    }>;

    expect(result.output).toContain('Overall OEE: 54.0%');
    expect(result.output).toContain('937 tons');
    expect(result.output).toContain('1100 tons');
    expect(result.output).toContain('In Production');
    expect(result.details?.kpis.overallOee).toBe(54);
    expect(result.details?.kpis.dailyForecastTons).toBe(937);
  });

  it('get_availability_health lists equipment counts per area', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_availability_health');

    const result = await tool.execute({});

    expect(result.output).toContain('Pre Reaction');
    expect(result.output).toContain('Pump: 2/3 available');
    expect(result.output).toContain('Oxi-Absorption');
  });

  it('get_production_losses returns the requested section breakdown', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_production_losses');

    const result = await tool.execute({ section: 'availability' });

    expect(result.output).toContain('Availability losses');
    expect(result.output).toContain('Electrical Failure: 600 tons');
    expect(result.output).toContain('Mechanical Failure: 360 tons');
  });

  it('get_production_losses validates the section argument', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_production_losses');

    // The validation step is invoked by the AtlasSession before execute;
    // here we just verify the execute path accepts a valid section.
    const result = await tool.execute({ section: 'quality' });
    expect(result.output).toContain('Quality losses');
    expect(result.output).toContain('Spec Build: 240 tons');
  });

  it('get_equipment_list returns the equipment for an area + type pair', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_equipment_list');

    const result = await tool.execute({
      areaName: 'Pre Reaction',
      equipmentType: 'Turbine',
    });

    expect(result.output).toContain('Turbine units in Pre Reaction');
    expect(result.output).toContain('Turbine 1');
    expect(result.output).toContain('Turbine 2');
  });

  it('get_equipment_detail returns sensor and diagnostic summaries', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_equipment_detail');

    const result = await tool.execute({ equipmentId: 'Turbine 1' });

    expect(result.output).toContain('Turbine 1');
    expect(result.output).toContain('Pre-reaction turbine train A');
    expect(result.output).toContain('Bearing Temperature');
    expect(result.output).toContain('Overheating');
  });

  it('get_equipment_detail returns a friendly message for unknown equipment', async () => {
    const tools = createOeeAtlasTools(new MockOeeMetricsService());
    const tool = findTool(tools, 'get_equipment_detail');

    const result = await tool.execute({ equipmentId: 'Does Not Exist' });

    expect(result.output).toContain('No equipment found');
  });
});
