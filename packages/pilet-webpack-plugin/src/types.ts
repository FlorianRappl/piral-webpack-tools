export interface SharedDependency {
  id: string;
  requireId?: string;
  name: string;
  ref: string;
  type: 'local' | 'remote';
  entry: string;
}

export interface PiletWebpackPluginOptions {
  /**
   * The name of the pilet.
   */
  name: string;
  /**
   * The version of the pilet.
   */
  version: string;
  /**
   * The name of the Piral instance / app shell.
   */
  piral: string;
  /**
   * The schema version. By default, v1 is used.
   */
  schema?: 'v0' | 'v1' | 'v2' | 'none';
  /**
   * The shared dependencies. By default, these are read from the
   * Piral instance.
   */
  externals?: Array<string>;
  /**
   * Additional environment variables to define.
   */
  variables?: Record<string, string>;
  /**
   * The shared dependencies to consider.
   */
  importmap?: Array<SharedDependency>;
}
