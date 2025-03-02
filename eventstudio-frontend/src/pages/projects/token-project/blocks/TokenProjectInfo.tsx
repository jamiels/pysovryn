import { useContext } from 'react';
import { TokenProjectsContext } from '../../providers';
import { useLoaders } from '@/providers';

const TokenProjectInfo = () => {
  const { currentTokenProject } = useContext(TokenProjectsContext);
  const { progressBarLoader } = useLoaders();

  return (
    <>
      {progressBarLoader ? (
        <div className="card min-w-full animate-pulse">
          <div className="card-header">
            <div className="h3 bg-slate-200 rounded-lg w-[200px] py-2"></div>
          </div>

          <div className="card-table scrollable-x-auto pb-3">
            <table className="table align-middle text-sm text-gray-500" id="general_info_table">
              <tbody>
                <tr>
                  <td className="min-w-56 text-gray-600 font-normal">Project</td>
                  <td className="min-w-48 w-full text-gray-800 font-normal">
                    <div className="bg-slate-200 rounded-lg w-[150px] pt-3"></div>
                  </td>
                </tr>

                <tr>
                  <td className="min-w-56 text-gray-600 font-normal">Project URL</td>
                  <td className="min-w-48 w-full text-gray-800 font-normal">
                    <div className="bg-slate-200 rounded-lg w-[150px] pt-3"></div>
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Symbol</td>
                  <td className="text-gray-800 font-normal">
                    <div className="bg-slate-200 rounded-lg w-[150px] pt-3"></div>
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Target Raise</td>
                  <td className="text-gray-800 font-normal">
                    <div className="bg-slate-200 rounded-lg w-[150px] pt-3"></div>
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Raise Stage</td>
                  <td className="text-gray-800 font-normal">
                    <div className="bg-slate-200 rounded-lg w-[150px] pt-3"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card min-w-full">
          <div className="card-header">
            <h3 className="card-title">Project Details</h3>
          </div>

          <div className="card-table scrollable-x-auto pb-3">
            <table className="table align-middle text-sm text-gray-500" id="general_info_table">
              <tbody>
                <tr>
                  <td className="min-w-80 text-gray-600 font-normal">Project</td>
                  <td className="min-w-48 w-full text-gray-800 font-normal">
                    {currentTokenProject?.name}
                  </td>
                </tr>

                <tr>
                  <td className="min-w-80 text-gray-600 font-normal">Project</td>
                  <td className="min-w-48 w-full text-gray-800 font-normal">
                    <a href={currentTokenProject?.projectUrl} target="_blank">
                      {currentTokenProject?.projectUrl}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Symbol</td>
                  <td className="text-gray-800 font-normal">{currentTokenProject?.symbol}</td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Target Raise</td>
                  <td className="text-gray-800 font-normal">{currentTokenProject?.targetRaise}</td>
                </tr>

                <tr>
                  <td className="text-gray-600 font-normal">Raise Stage</td>
                  <td className="text-gray-800 font-normal">{currentTokenProject?.raiseStage}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export { TokenProjectInfo };
