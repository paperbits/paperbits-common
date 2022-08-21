export interface SecurityModelBinder<TSecurityContract, TSecurityModel> {
    contractToModel(contract: TSecurityContract): TSecurityModel;
    modelToContract(model: TSecurityModel): TSecurityContract;
}
