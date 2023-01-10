import warnings
import bioframe
import numpy as np
import pandas as pd


def _extract_eigs(
    eigvals,
    eigvecs,
    n_clusters,
    n_components,
    weight_by_eigval,
    keep_first,
    positive_eigs=False,
    filter_nans=True
):
    eigvecs = eigvecs.copy()

    # Decide whether to use unit normed vectors or to weight them by sqrt(|lambda_i|)
    if weight_by_eigval:
        eigvecs.loc[:, 'E0':] *= np.sqrt(np.abs(eigvals.T.values))

    # Do the k-clustering on top k eigenvectors, unless overriden to use more or fewer
    if n_components is None:
        n_components = n_clusters

    if not positive_eigs:
        # Decide whether to use E0 or not
        if keep_first:
            elo, ehi = 'E0', f'E{n_components - 1}'
        else:
            elo, ehi = 'E1', f'E{n_components}'
        X = eigvecs.loc[:, elo:ehi].values
    else:
        if not keep_first:
            eigvals = eigvals.drop('E0')
        which = eigvals.loc[eigvals['val'] > 0].index[:n_components]
        X = eigvecs.loc[:, which].values

    if not filter_nans:
        return X

    mask = np.all(~np.isnan(X), axis=1)
    x = X[mask, :]

    return x, mask
